import { Client, GatewayIntentBits } from "discord.js";
import type { NextApiRequest, NextApiResponse } from "next";

// Crear cliente de Discord
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages],
});

// Iniciar sesión con el token del bot
client.login(process.env.DISCORD_BOT_TOKEN!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { userId, inviteLink } = req.body;

  if (!userId || !inviteLink) {
    return res.status(400).json({ message: "Faltan datos en la solicitud" });
  }

  try {
    const user = await client.users.fetch(userId);
    if (user) {
      await user.send(
        `¡Hola! Has creado un nuevo proyecto. Únete a nuestro servidor de Discord con este enlace: ${inviteLink}`
      );
      console.log(`Invitación enviada a ${user.tag}`);
      return res.status(200).json({ message: "Invitación enviada con éxito" });
    }
  } catch (error) {
    console.error("Error enviando la invitación:", error);
    return res.status(500).json({ message: "Error al enviar la invitación" });
  }
}
