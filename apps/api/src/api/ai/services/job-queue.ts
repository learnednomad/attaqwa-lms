/**
 * In-Memory AI Job Queue
 * Manages async AI operations with concurrency limiting.
 * Jobs expire after 1 hour. Max 2 concurrent jobs.
 */

export type AIJobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface AIJob<T = any> {
  id: string;
  type: string;
  status: AIJobStatus;
  result?: T;
  error?: string;
  createdAt: number;
  startedAt?: number;
  completedAt?: number;
}

const jobs = new Map<string, AIJob>();
const MAX_CONCURRENT = parseInt(process.env.OLLAMA_MAX_PARALLEL || '2', 10);
const JOB_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

let activeCount = 0;
let jobCounter = 0;

// Clean up expired jobs every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, job] of jobs.entries()) {
    if (now - job.createdAt > JOB_EXPIRY_MS) {
      jobs.delete(id);
    }
  }
}, 10 * 60 * 1000);

function generateJobId(): string {
  jobCounter++;
  return `ai-job-${Date.now()}-${jobCounter}`;
}

/**
 * Get a job by ID.
 */
export function getJob(jobId: string): AIJob | undefined {
  return jobs.get(jobId);
}

/**
 * Submit an async AI task. Returns a job ID immediately.
 * The task function is executed when a concurrency slot is available.
 */
export function submitJob<T>(
  type: string,
  taskFn: () => Promise<T>
): AIJob<T> {
  const id = generateJobId();
  const job: AIJob<T> = {
    id,
    type,
    status: 'pending',
    createdAt: Date.now(),
  };

  jobs.set(id, job);
  processJob(id, taskFn);

  return job;
}

async function processJob<T>(
  jobId: string,
  taskFn: () => Promise<T>
): Promise<void> {
  const job = jobs.get(jobId);
  if (!job) return;

  // Wait for a concurrency slot
  while (activeCount >= MAX_CONCURRENT) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Check if job was deleted while waiting
    if (!jobs.has(jobId)) return;
  }

  activeCount++;
  job.status = 'processing';
  job.startedAt = Date.now();

  try {
    const result = await taskFn();
    job.status = 'completed';
    job.result = result;
    job.completedAt = Date.now();
  } catch (error: any) {
    job.status = 'failed';
    job.error = error.message || 'Unknown error';
    job.completedAt = Date.now();
  } finally {
    activeCount--;
  }
}

/**
 * Get queue stats.
 */
export function getQueueStats(): {
  totalJobs: number;
  active: number;
  pending: number;
  completed: number;
  failed: number;
  maxConcurrent: number;
} {
  let pending = 0;
  let active = 0;
  let completed = 0;
  let failed = 0;

  for (const job of jobs.values()) {
    switch (job.status) {
      case 'pending': pending++; break;
      case 'processing': active++; break;
      case 'completed': completed++; break;
      case 'failed': failed++; break;
    }
  }

  return {
    totalJobs: jobs.size,
    active,
    pending,
    completed,
    failed,
    maxConcurrent: MAX_CONCURRENT,
  };
}
