#!/usr/bin/env node

/**
 * Standalone seed script runner
 * Runs the comprehensive seed importer via Strapi API
 */

import { compileStrapi } from '@strapi/strapi';
import { runComprehensiveSeed } from './import-comprehensive-seed';

async function main() {
  console.log('\n🚀 Starting Strapi instance for seeding...\n');

  let strapi: any;

  try {
    // Initialize Strapi
    console.log('📦 Initializing Strapi...');
    const appContext: any = await compileStrapi();
    strapi = await appContext.start();
    console.log('✅ Strapi initialized\n');

    // Run comprehensive seed
    await runComprehensiveSeed(strapi);
    console.log('\n✅ Seed process completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Seed process failed:', error);
    process.exit(1);
  } finally {
    if (strapi) {
      await strapi.destroy();
    }
    process.exit(0);
  }
}

main();
