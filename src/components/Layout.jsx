import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="d-flex flex-column vh-100">
            <Header />
            <div className="d-flex flex-grow-1 overflow-hidden">
                <Sidebar />
                <main className="flex-grow-1 overflow-auto p-4 bg-light">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
