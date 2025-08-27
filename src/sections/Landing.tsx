'use client';
import { useAuth } from "@/context/AuthProvider";

const Landing: React.FC = () => {
    const { isAuthenticated } = useAuth();
    return (
        <div>
            <h1>Welcome to the Landing Page</h1>
            {isAuthenticated ? (
                <p>You are logged in!</p>
            ) : (
                <p>Please log in to access more features.</p>
            )}
        </div>
    );
}

export default Landing;
