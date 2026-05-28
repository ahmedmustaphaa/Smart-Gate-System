import { useContext, createContext, useEffect, useState } from 'react';
import { Api } from '../api/axios';
import toast from 'react-hot-toast';

const AppContext = createContext();

function Context({ children }) {

    const [data,setData]=useState();

 const AddGate = async (dataItem) => {
    try {
        // 🌟 بنولد الـ Key هنا في الفرونت ونضيفه على الداتا قبل ما نبعتها
        const generatedApiKey = `sk_live_${Math.random().toString(36).substring(2, 11)}${Math.random().toString(36).substring(2, 7)}`;
        
        const { data } = await Api.post('/gate/create', { 
            ...dataItem, 
            apiKey: generatedApiKey // ضفناه هنا
        });
        
        if (data.success) {
            toast.success("Gate added successfully");
            return true;
        }
    } catch (error) {
        const errorMsg = error.response?.data?.message || "Something went wrong";
        toast.error(errorMsg);
        return false;
    }
};

const getDashboardData=async()=>{
    try{
        const {data}=await Api.get('/gate/dashboard');
        console.log(data);
        setData(data.data)

    }catch(error){
        const errmsg=error.response?.data?.message  || "Something want wrong";
        toast.error(errmsg)
    }
}


    const val = {
        AddGate,
        getDashboardData,
        data
    };

    return (
        <AppContext.Provider value={val}>
            {children}
        </AppContext.Provider>
    );
}

export const ShareContext = () => {
    return useContext(AppContext);
};

export default Context;