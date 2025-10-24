export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Student Module Test Page</h1>
      <p>If you can see this, the student routes are working!</p>
      <div className="mt-4">
        <h2 className="font-semibold">Test Credentials:</h2>
        <ul className="list-disc list-inside">
          <li>Email: student@attaqwa.org</li>
          <li>Password: student123</li>
          <li>Student ID: STU2024003</li>
        </ul>
      </div>
    </div>
  );
}