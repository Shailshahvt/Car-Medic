/**
 * This file defines the main App class, 
 * which initializes the Express application, configures middlewares, 
 * sets up API routers, and handles SPA routing.
 * 
 * Author: Ahmed Aredah, Sahil Sharma
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

class App {
  constructor(routers) {
    this.app = express();
    this.port = process.env.PORT || 5001;

    this.initializeMiddlewares();
    this.initializeRouters(routers);
    this.initializeSPARouting();
  }

  initializeMiddlewares() {
    // Configure CORS
    this.app.use(cors({
      origin: ['http://localhost:5001', 'http://localhost:3000'],
      credentials: true
    }));
    
    this.app.use(bodyParser.json());
    
    // Correct the static files path
    this.app.use(express.static(path.join(__dirname, '..', 'public')));
  }

  initializeRouters(routers) {
    routers.forEach((router) => {
      this.app.use('/api', router.router);
    });
  }

  initializeSPARouting() {
    // Serve index.html for all non-API routes
    this.app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
      }
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }
}

export default App;