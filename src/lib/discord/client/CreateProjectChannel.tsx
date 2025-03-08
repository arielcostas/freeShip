
import { Client, GatewayIntentBits, ChannelType, TextChannel } from 'discord.js';
import { createClient } from "@/lib/supabase/client";

// Configurar el cliente de Discord con los permisos necesarios
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});

// Autenticación con token de bot (deberás obtener esto del Discord Developer Portal)
// Es importante guardar este token como variable de entorno
const DISCORD_BOT_TOKEN = process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN;
const DISCORD_GUILD_ID = process.env.NEXT_PUBLIC_DISCORD_GUILD_ID; // ID del servidor de Discord

// Iniciar el cliente de Discord
const initDiscordClient = async () => {
  if (!client.isReady()) {
    try {
      await client.login(DISCORD_BOT_TOKEN);
      console.log('Bot de Discord conectado');
    } catch (error) {
      console.error('Error al conectar con Discord:', error);
    }
  }
  return client;
};

// Función para crear un canal de chat para un proyecto
export const createProjectChannel = async (
  projectTitle: string,
  projectId: string,
  authorId: string
) => {
  try {
    // Iniciar el cliente si no está listo
    if (!client.isReady()) {
      await initDiscordClient();
    }

    // Obtener el servidor de Discord
    const guild = client.guilds.cache.get(DISCORD_GUILD_ID);
    if (!guild) {
      throw new Error('No se pudo encontrar el servidor de Discord');
    }

    // Nombre del canal basado en el título del proyecto
    const channelName = `proyecto-${projectTitle.toLowerCase().replace(/\s+/g, '-')}`;

    // Crear el canal de texto
    const channel = await guild.channels.create({
      name: channelName,
      type: ChannelType.GuildText,
      topic: `Canal de comunicación para el proyecto: ${projectTitle}`,
    });

    // Ahora necesitamos vincular al autor con su cuenta de Discord
    // Para esto, primero obtenemos el discordId del usuario desde la base de datos
    const supabase = createClient();
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('discord_id')
      .eq('id', authorId)
      .single();

    if (profileError || !profileData?.discord_id) {
      console.error('Error al obtener el discord_id del usuario:', profileError);
      await channel.send('Proyecto creado. El autor necesita vincular su cuenta de Discord para ser añadido automáticamente.');
    } else {
      // Añadir al usuario al canal (si tiene su cuenta vinculada)
      try {
        // Obtener el miembro del servidor por su ID de Discord
        const member = await guild.members.fetch(profileData.discord_id);

        // Dar permisos específicos al usuario en este canal
        await (channel as TextChannel).permissionOverwrites.create(member, {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true,
        });

        await channel.send(`¡Bienvenido al canal de proyecto ${projectTitle}! @${member.user.username}`);
      } catch (memberError) {
        console.error('Error al añadir al usuario al canal:', memberError);
        await channel.send('No se pudo añadir automáticamente al autor al canal.');
      }
    }

    // Guardar la referencia del canal en Supabase
    const { error: updateError } = await supabase
      .from('projects')
      .update({
        discord_channel_id: channel.id,
      })
      .eq('id', projectId);

    if (updateError) {
      console.error('Error al guardar el ID del canal en la base de datos:', updateError);
    }

    return {
      channelId: channel.id,
      channelUrl: `https://discord.com/channels/${guild.id}/${channel.id}`,
    };
  } catch (error) {
    console.error('Error al crear el canal de Discord:', error);
    throw error;
  }
};

// Función para añadir un usuario a un canal de proyecto
export const addUserToProjectChannel = async (
  userId: string,
  projectId: string
) => {
  try {
    // Iniciar el cliente si no está listo
    if (!client.isReady()) {
      await initDiscordClient();
    }

    const supabase = createClient();

    // Obtener el discord_id del usuario
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('discord_id')
      .eq('id', userId)
      .single();

    if (userError || !userData?.discord_id) {
      throw new Error('Usuario no tiene cuenta de Discord vinculada');
    }

    // Obtener el discord_channel_id del proyecto
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('discord_channel_id, title')
      .eq('id', projectId)
      .single();

    if (projectError || !projectData?.discord_channel_id) {
      throw new Error('El proyecto no tiene canal de Discord vinculado');
    }

    // Obtener el servidor y el canal
    const guild = client.guilds.cache.get(DISCORD_GUILD_ID);
    if (!guild) {
      throw new Error('No se pudo encontrar el servidor de Discord');
    }

    const channel = guild.channels.cache.get(projectData.discord_channel_id) as TextChannel;
    if (!channel) {
      throw new Error('No se pudo encontrar el canal de Discord');
    }

    // Añadir al usuario al canal
    const member = await guild.members.fetch(userData.discord_id);
    await channel.permissionOverwrites.create(member, {
      ViewChannel: true,
      SendMessages: true,
      ReadMessageHistory: true,
    });

    await channel.send(`¡Bienvenido al proyecto ${projectData.title}, @${member.user.username}!`);

    return true;
  } catch (error) {
    console.error('Error al añadir usuario al canal:', error);
    return false;
  }
};

export default {
  initDiscordClient,
  createProjectChannel,
  addUserToProjectChannel,
};