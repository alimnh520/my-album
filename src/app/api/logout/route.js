import { NextResponse } from "next/server"

export const GET = async() => {
    const response = NextResponse.json({message: 'Logout successful', success: true});
    response.cookies.delete('user-access');
    return response;
}