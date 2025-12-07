export const metadata = {
    title: 'DevOps Todo App',
    description: 'Next.js Todo Application with MongoDB - DevOps Assignment 3',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
