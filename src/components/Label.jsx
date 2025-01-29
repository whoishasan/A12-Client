const Label = ({ className, children }) => {
  return (
    <>
      <span
        className={`flex px-3 py-1 bg-orange-500 text-white rounded-full ${className}`}
      >
        {children}
      </span>
    </>
  );
};

export default Label;
