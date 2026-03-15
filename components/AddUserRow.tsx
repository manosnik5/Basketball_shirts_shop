"use client";

import { useState } from "react";
import Image from "next/image";
import { admin } from "@/lib/auth-client";
import { 
  sanitizeString, 
  sanitizeEmail, 
  validateEmail, 
  validatePassword,
  validateRequired 
} from '@/lib/validation';

const AddUserRow = () => {
    const [isAddUserButtonPressed, setIsAddUserButtonPressed] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('USER');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAddUser = async () => {

        const sanitizedName = sanitizeString(name);
        const sanitizedEmail = sanitizeEmail(email);
        
        if (!validateRequired(sanitizedName) || !validateRequired(sanitizedEmail) || !password) {
            setError('Please fill in all required fields');
            return;
        }

        if (!validateEmail(sanitizedEmail)) {
            setError('Please enter a valid email address');
            return;
        }

        if (!validatePassword(password, 8)) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);
        setError('');
        
        try {
            await admin.createUser({
                name: sanitizedName,
                email: sanitizedEmail,
                password,
                role: role as 'USER' | 'ADMIN',
            });
            
       
            setName('');
            setEmail('');
            setPassword('');
            setRole('USER');
            

            window.location.reload();
        } catch (err: unknown) {
            console.error('Error adding user:', err);
            setError(err instanceof Error ? err.message : 'Failed to add user');
        }
        finally {
            setIsLoading(false);
        }
    };
  return (
    <div>
       {isAddUserButtonPressed ? 
       <div className="w-full flex flex-col sm:flex-row justify-between">
        <div className="px-4 py-2">
           
             <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Name'
                    className='w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
  
        </div>
        <div className="px-4 py-2">
             <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Email'
                className='w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
        </div>
        <div className="px-4 py-2">
               <input
                        type='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        placeholder='Password'
                        className='w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />
        </div>
        <div className="px-4 py-2">
             <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className='px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500'
                >
                    <option value='USER'>USER</option>
                    <option value='ADMIN'>ADMIN</option>
                </select>
        </div>
        <div className="space-y-2 px-4 py-2">
            <div className='flex gap-2 justify-center'>
                        <button
                            onClick={handleAddUser}
                            disabled={isLoading}
                            className='px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 cursor-pointer'
                        >
                            {isLoading ? 'Adding...' : 'Save'}
                        </button>
                        <button
                            onClick={() => {
                                setName('');
                                setEmail('');
                                setPassword('');
                                setRole('USER');
                                setError('');
                                setIsAddUserButtonPressed(false);
                            }}
                            disabled={isLoading}
                            className='px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 cursor-pointer'
                        >
                            Cancel
                        </button>
                    </div>
                    {error && (
                        <div className='text-xs text-red-600'>{error}</div>
                    )}
                </div>
          
           </div>: 
        <div className="w-full flex justify-center py-2">
            <button onClick={() => setIsAddUserButtonPressed((e) => !e)} className="hover:opacity-70 cursor-pointer">
                 <Image src="/add.png" alt="NextRide" width={27} height={27} priority></Image>
            </button>
           
        </div> }
    </div>
        
    );
}

export default AddUserRow