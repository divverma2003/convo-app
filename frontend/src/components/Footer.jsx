const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t py-6 mt-auto"
      style={{
        background:
          "linear-gradient(135deg, #f6e2f2 0%, #fac1ee 50%, #f3a7e3 100%)",
        borderTopColor: "rgba(139, 92, 51, 0.2)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <div className="flex flex-col items-center gap-2">
          <p
            className="font-bold text-lg"
            style={{
              background:
                "linear-gradient(45deg, #8b5c33 0%, #654321 50%, #3d2314 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            © {currentYear} Convo by &lt;div&gt;ya
          </p>
          <p
            className="text-sm font-medium"
            style={{ color: "#654321", opacity: 0.8 }}
          >
            work in prog-mess 🚧
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
