
import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // Verificar si hay un código de autorización
  if (!code) {
    return NextResponse.redirect(new URL('/perfil?error=no_code', request.url));
  }

  try {
    // Intercambiar el código por un token de acceso
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID!,
        client_secret: process.env.DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${new URL(request.url).origin}/api/discord/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('No se pudo obtener el token de acceso');
    }

    // Obtener información del usuario de Discord
    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    // Obtener el usuario actual de Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=not_authenticated', request.url));
    }

    // Actualizar el perfil del usuario con la información de Discord
    await supabase
      .from('profiles')
      .update({
        discord_id: userData.id,
        discord_username: `${userData.username}${userData.discriminator !== '0' ? `#${userData.discriminator}` : ''}`,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    // Añadir al usuario al servidor de Discord (opcional, si quieres que se unan automáticamente)
    if (tokenData.scope.includes('guilds.join')) {
      await fetch(`https://discord.com/api/guilds/${process.env.DISCORD_GUILD_ID}/members/${userData.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_token: tokenData.access_token,
        }),
      });
    }

    // Redireccionar de vuelta al perfil con éxito
    return NextResponse.redirect(new URL('/perfil?discord=success', request.url));
  } catch (error) {
    console.error('Error al procesar la autorización de Discord:', error);
    return NextResponse.redirect(new URL('/perfil?error=process_failed', request.url));
  }
}