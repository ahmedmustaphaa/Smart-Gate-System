import express from 'express';
import { LoginAdmin } from '../controller/auth.js';
export const UserRouter=express.Router();


UserRouter.post('/login',LoginAdmin)



