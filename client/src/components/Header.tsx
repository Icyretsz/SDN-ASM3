import AuthButton from "./AuthButton.tsx";

const Header = () => {
    return (
        <header className='w-full h-20 px-26 bg-red-200 flex justify-between items-center'>
            <p className='font-bold text-3xl'>ABC Perfume</p>
            <section className='flex gap-5'>
                <AuthButton type='login'/>
                <AuthButton type='signup'/>
            </section>
        </header>
    );
};

export default Header;