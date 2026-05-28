import express from 'express';
import { CreateOnwer, DeleteOwner, FetchOwner, updateOwner, verifyQRCode } from '../controller/ownerController.js';

export const OwnerRouter=express.Router();


OwnerRouter.post('/create',CreateOnwer);
OwnerRouter.delete('/delete/:id',DeleteOwner);
OwnerRouter.put('/update',updateOwner);
OwnerRouter.get('/get-Owner',FetchOwner);
OwnerRouter.put('/verfiy',verifyQRCode);