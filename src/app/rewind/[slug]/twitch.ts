'use server'

export type Clips = {
    data:       Data[];
    pagination: Pagination;
}

type Data = {
    id:               string;
    url:              string;
    embed_url:        string;
    broadcaster_id:   string;
    broadcaster_name: string;
    creator_id:       string;
    creator_name:     string;
    video_id:         string;
    game_id:          string;
    language:         string;
    title:            string;
    view_count:       number;
    created_at:       Date;
    thumbnail_url:    string;
    duration:         number;
    vod_offset:       number;
}

type Pagination = {
    cursor: string;
}

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

export async function getTwitchAuthorization(): Promise<string | undefined> {
if (!clientId || !clientSecret) {
    console.log("Please put your client id and the client secret in the environment file");          
    return;
  }

  const endpoint = `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`;

  const response = await fetch(endpoint, {
    method: "POST",
  });

  const data = await response.json();
  const { access_token, token_type } = data;

  // token_type first letter must be uppercase
  const formattedTokenType = token_type.charAt(0).toUpperCase() + token_type.slice(1);

  return `${formattedTokenType} ${access_token}`;
}

export async function getUserId(name: string, authorization: string): Promise<string | undefined> {
  if (!clientId) return;

  const endpoint = `https://api.twitch.tv/helix/users?login=${name}`;

  const headers = {
    authorization,
    "Client-Id": clientId,
  };

  const response = await fetch(endpoint, {
    headers,
  });

  const data = await response.json();
  if (data.data) {
    return data.data[0].id;
  }

  return;
}

export async function getClips(id: string, authorization: string, numberOfClips: string, startDate: string, endDate: string): Promise<Clips | undefined> {
  if (!clientId) return;

  let endpoint = `https://api.twitch.tv/helix/clips?broadcaster_id=${id}`;
  
  if (numberOfClips) endpoint += `&first=${numberOfClips}`;

  // Check if the start date and end date are valid
  if (startDate && endDate && Date.parse(startDate) < Date.parse(endDate)) {
    endpoint += `&started_at=${startDate}T00:00:00Z&ended_at=${endDate}T00:00:00Z`;
  } else if (Date.parse(startDate) < Date.now()) {
    const currentDate = new Date().toISOString();
    endpoint += `&started_at=${startDate}T00:00:00Z&ended_at=${currentDate}`;
  }

  const headers = {
    authorization,
    "Client-Id": clientId,
  };

  const response = await fetch(endpoint, {
    headers,
  });

  const data: Clips = await response.json();
  return data;
}