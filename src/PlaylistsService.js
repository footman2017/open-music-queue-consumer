const { Pool } = require("pg");

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylists(playlistId) {
    const query = {
      text: `
        select p.id as playlist_id, p."name", u.username, s.id as song_id, s.title, s.performer
        from playlist_songs ps 
        left join playlists p on p.id = ps.playlist_id 
        left join songs s on s.id = ps.song_id
        left join users u on u.id = p."owner"
        where ps.playlist_id = $1
      `,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    const playlist = {
      id: result.rows[0].playlist_id,
      name: result.rows[0].name,
      songs: result.rows.map((row) => ({
        id: row.song_id,
        title: row.title,
        performer: row.performer,
      })),
    };
    return { playlist: playlist };
  }
}

module.exports = PlaylistsService;
