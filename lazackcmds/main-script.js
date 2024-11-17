import axios from 'axios';

let handler = async (m, { conn }) => {
  const githubRepoURL = 'https://github.com/Lazack28/Lazack-Device';

  try {
    const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
    
    const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);
    
    if (response.status === 200) {
      const repoData = response.data;

      // Create the location message with the repository information
      let msg = await generateWAMessageFromContent(m.chat, {
        locationMessage: {
          degreesLatitude: 0,
          degreesLongitude: 0,
          name: repoData.name,
          address: 'Tanzania', // You can change this to a more relevant address if needed
          url: repoData.html_url,
          isLive: true,
          accuracyInMeters: 0,
          speedInMps: 0,
          degreesClockwiseFromMagneticNorth: 2,
          comment: repoData.description || "Your Welcome",
          jpegThumbnail: await conn.resize("https://imgur.com/q7WXO5w.jpeg", 300, 300),
        },
      }, { quoted: m });

      // Send the location message
      return conn.relayMessage(m.chat, msg.message, {});
    } else {
      throw new Error(`Error fetching repository: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    await conn.reply(m.chat, `An error occurred: ${error.message}`, m);
  }
}

handler.help = ['repo'];
handler.tags = ['info'];
handler.command = ['sc', 'repo'];

export default handler;