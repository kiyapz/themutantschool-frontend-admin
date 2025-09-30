export default function TailwindTest() {
  return (
    <div className="p-4 bg-red-500 text-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-2">Tailwind CSS Test</h2>
      <p className="text-sm opacity-90">
        If you can see this red box with white text, Tailwind is working!
      </p>
      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded transition-colors">
          Test Button
        </button>
        <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded transition-colors">
          Another Button
        </button>
      </div>
    </div>
  );
}
