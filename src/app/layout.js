export const metadata = {
    title: 'Auth System',
    description: 'Authentication-only app with MongoDB - DevOps Assignment 3',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
