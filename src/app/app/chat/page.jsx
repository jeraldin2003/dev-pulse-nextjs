"use client";
import {ChatBar, ChatSpace} from './_components';
import { useState, useEffect } from 'react';
import useFetch from '@/lib/auth';
import useAuth from '@/context/AuthContext';

export default function Chat() {
  // const { user }  
  // const 
  
  // useEffect(()=>{


  // })
  return (
    <>
      <div className="h-full w-full flex">
        <ChatBar/>
        <ChatSpace/>
      </div>
    </>
  )
}