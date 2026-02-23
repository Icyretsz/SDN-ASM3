interface AuthButtonProps {
    type: 'login' | 'signup' | 'signout'
    onClick: () => void
}

const AuthButton = ({ type, onClick }: AuthButtonProps) => {
    const labels = {
        login: 'Login',
        signup: 'Sign Up',
        signout: 'Sign Out',
    }

    const colors = {
        login: 'bg-blue-400 hover:bg-blue-500',
        signup: 'bg-green-400 hover:bg-green-500',
        signout: 'bg-red-400 hover:bg-red-500',
    }

    return (
        <button
            onClick={onClick}
            className={`${colors[type]} text-white px-4 py-2 rounded-xl transition-transform hover:scale-105`}
        >
            {labels[type]}
        </button>
    )
}

export default AuthButton