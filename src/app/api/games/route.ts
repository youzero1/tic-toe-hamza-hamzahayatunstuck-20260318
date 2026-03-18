import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { Game } from '@/lib/entities/Game';

export async function GET() {
  try {
    const ds = await getDataSource();
    const gameRepo = ds.getRepository(Game);
    const games = await gameRepo.find({
      order: { createdAt: 'DESC' },
    });
    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { winner, board } = body;

    if (!winner || !board) {
      return NextResponse.json(
        { error: 'Missing required fields: winner and board' },
        { status: 400 }
      );
    }

    if (!['X', 'O', 'draw'].includes(winner)) {
      return NextResponse.json(
        { error: 'Invalid winner value' },
        { status: 400 }
      );
    }

    const ds = await getDataSource();
    const gameRepo = ds.getRepository(Game);

    const game = gameRepo.create({
      winner,
      board: typeof board === 'string' ? board : JSON.stringify(board),
    });

    const savedGame = await gameRepo.save(game);
    return NextResponse.json(savedGame, { status: 201 });
  } catch (error) {
    console.error('Error saving game:', error);
    return NextResponse.json(
      { error: 'Failed to save game' },
      { status: 500 }
    );
  }
}
