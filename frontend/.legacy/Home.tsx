export const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <h1 className="text-5xl font-bold mb-4">Explore Sorting Algorithms in Action!</h1>
      <p className="text-xl text-muted-foreground mb-8">Master sorting techniques through interactive visualizations.</p>
      <div className="flex gap-4">
        <a href="/visualizer" className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-md">Start Visualizing</a>
        <a href="/algorithms" className="px-6 py-3 border border-primary text-primary font-semibold rounded-md">Learn More</a>
      </div>
    </div>
  );
};
