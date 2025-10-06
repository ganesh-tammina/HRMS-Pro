import { Request, Response } from 'express';
import * as leaveService from '../services/leave.services';

export const createLeaveBalance = async (req: Request, res: Response) => {
  try {
    const result = await leaveService.createLeaveBalance(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createLeaveRequest = async (req: Request, res: Response) => {
  try {
    const result = await leaveService.createLeaveRequest(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getLeaveBalances = async (_req: Request, res: Response) => {
  console.log("getLeaveBalances called");
  
  try {
    const result = await leaveService.getLeaveBalances();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getLeaveRequests = async (_req: Request, res: Response) => {
  try {
    const result = await leaveService.getLeaveRequests();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
