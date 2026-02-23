import AuthButton from "./AuthButton.tsx";
import { useAuthStore } from "../stores/authStore";
import { useLogout } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const Header = () => {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const logout = useLogout();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className='w-full h-20 px-26 bg-red-200 flex justify-between items-center'>
            <p className='font-bold text-3xl cursor-pointer' onClick={() => navigate('/')}>ABC Perfume</p>
            <section className='flex gap-5 items-center'>
                {user ? (
                    <>
                        <span 
                            className='text-gray-700 cursor-pointer hover:text-blue-600 transition-colors'
                            onClick={() => navigate('/profile')}
                        >
                            Welcome, {user.name}
                        </span>
                        <AuthButton type='signout' onClick={handleLogout}/>
                    </>
                ) : (
                    <>
                        <AuthButton type='login' onClick={() => navigate('/login')}/>
                        <AuthButton type='signup' onClick={() => navigate('/signup')}/>
                    </>
                )}
            </section>
        </header>
    );
};

export default Header;