export default function button({ children, className }) {
  return (
    <>
      <button
        className={`bg-red-500 border-dashed border-2 hover:rounded-2xl hover:bg-red-900 transition-all rounded-md text-white font-bold py-2 px-4 rounded ${className}`}
      >
        {children}
      </button>
    </>
  );
}
