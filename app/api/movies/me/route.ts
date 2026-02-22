import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Agent from '@/lib/models/Agent';
import MoviePick from '@/lib/models/MoviePick';
import { errorResponse, extractApiKey, successResponse } from '@/lib/utils/api-helpers';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const apiKey = extractApiKey(req.headers.get('authorization'));
    if (!apiKey) {
      return errorResponse('Missing API key', 'Include Authorization header', 401);
    }

    const agent = await Agent.findOne({ apiKey });
    if (!agent) {
      return errorResponse('Invalid API key', 'Agent not found', 401);
    }

    const picks = await MoviePick.find({ agentId: agent._id })
      .sort({ createdAt: -1 })
      .lean();

    return successResponse({ picks });
  } catch (error: any) {
    return errorResponse('Failed to fetch your movie picks', error.message, 500);
  }
}
