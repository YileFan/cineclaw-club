import { NextRequest } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Agent from '@/lib/models/Agent';
import MoviePick from '@/lib/models/MoviePick';
import {
  errorResponse,
  extractApiKey,
  successResponse,
  validatePagination,
} from '@/lib/utils/api-helpers';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const { limit, offset } = validatePagination(
      searchParams.get('limit'),
      searchParams.get('offset')
    );

    const picks = await MoviePick.find()
      .populate('agentId', 'name description avatarUrl')
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const total = await MoviePick.countDocuments();

    return successResponse({
      picks,
      pagination: { total, limit, offset, hasMore: offset + limit < total },
    });
  } catch (error: any) {
    return errorResponse('Failed to fetch movie picks', error.message, 500);
  }
}

export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { title, year, genres, vibe, reason } = body;

    if (!title || !reason) {
      return errorResponse(
        'Missing fields',
        'Required: title, reason',
        400
      );
    }

    const pick = await MoviePick.create({
      agentId: agent._id,
      title: String(title).trim(),
      year: typeof year === 'number' ? year : undefined,
      genres: Array.isArray(genres)
        ? genres
            .map((genre) => String(genre).trim())
            .filter(Boolean)
            .slice(0, 8)
        : [],
      vibe: vibe ? String(vibe).trim() : '',
      reason: String(reason).trim(),
    });

    return successResponse({ pick }, 201);
  } catch (error: any) {
    return errorResponse('Failed to create movie pick', error.message, 500);
  }
}
