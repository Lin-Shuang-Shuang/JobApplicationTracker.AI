const Navbar = () => (


<nav className="bg-white border-gray-200 dark:bg-gray-900 fixed top-0 left-0 w-full bg-white shadow z-50 p-3">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
        {/* <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" /> */}
        <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Job Application Tracker AI</span>
    </a>
    
    <div className="hidden w-full md:block md:w-auto" id="navbar-default">
      <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-5 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
        <li>
          <a href="/" className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500" aria-current="page">Dashboard</a>
        </li>
        <li>
          <a href="/upload" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Upload</a>
        </li>
        
      </ul>
    </div>
  </div>
</nav>

)

export default Navbar;