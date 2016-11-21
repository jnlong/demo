module.exports = {
    Compress: {
        match: /css|js|html|png/ig
    },
    Expires: {
        fileMatch: /^(gif|png|jpg|js|css)$/ig,
        maxAge: 60 * 60 * 24 * 365
    }
}
