export const Footer = () => {
  return (
    <footer className="p-6 bg-background border-t text-center text-muted-foreground mt-auto">
      <p>&copy; {new Date().getFullYear()} Sorting Visualizer. All rights reserved.</p>
    </footer>
  );
};
