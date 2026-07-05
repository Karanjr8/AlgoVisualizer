import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  
  // Minimal diagnostic log
  console.log('Routes mounted:');
  const r = app._router;
  if (r && r.stack) {
    for (let i=0; i<r.stack.length; i++) {
      const layer = r.stack[i];
      if (layer.name === 'router') {
        console.log(layer.regexp);
      }
    }
  }
});

setInterval(() => {}, 1000 * 60 * 60);
