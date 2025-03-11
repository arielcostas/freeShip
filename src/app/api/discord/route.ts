import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, projectId, discordUsername } = await req.json();

    if (!title || !projectId || !discordUsername) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
    const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

    if (!DISCORD_BOT_TOKEN || !DISCORD_GUILD_ID) {
      return NextResponse.json({ error: "Faltan configuraciones del bot de Discord" }, { status: 500 });
    }

    // Crear un nuevo canal de texto en Discord
    const discordResponse = await fetch(`https://discord.com/api/v10/guilds/${DISCORD_GUILD_ID}/channels`, {
      method: "POST",
      headers: {
        Authorization: `Bot ${DISCORD_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: `proyecto-${projectId.slice(0, 5)}`, // Nombre basado en el ID del proyecto
        type: 0, // Canal de texto
        topic: `Canal para el proyecto: ${title}`,
      }),
    });

    if (!discordResponse.ok) {
      const errorData = await discordResponse.json();
      console.error("Error al crear canal en Discord:", errorData);
      return NextResponse.json({ error: "No se pudo crear el canal de Discord" }, { status: 500 });
    }

    const channelData = await discordResponse.json();
    const discordChannel = {
      channelId: channelData.id,
      channelUrl: `https://discord.com/channels/${DISCORD_GUILD_ID}/${channelData.id}`,
    };

    // Retornar la info del canal creado
    return NextResponse.json(discordChannel);
  } catch (error) {
    console.error("Error en API Discord:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
