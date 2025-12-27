const PageContainer = ({ title, children }) => {
  return (
    <div className="p-8">
      {title && (
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        </div>
      )}
      {children}
    </div>
  );
};

export default PageContainer;
