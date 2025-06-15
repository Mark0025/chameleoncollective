'use client';

interface SideNavClientProps {
    brandName: string;
}

export default function SideNavClient({ brandName }: SideNavClientProps) {
    return (
        <nav style={{ background: 'black', color: 'white', padding: '1rem', minHeight: '100vh' }}>
            <div style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '2rem' }}>{brandName}</div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                <li><a href="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</a></li>
                <li><a href="/dashboard/bookings" style={{ color: 'white', textDecoration: 'none' }}>Bookings</a></li>
                <li><a href="/dashboard/rentals" style={{ color: 'white', textDecoration: 'none' }}>Rentals</a></li>
                {/* Add more links as needed */}
            </ul>
        </nav>
    );
} 