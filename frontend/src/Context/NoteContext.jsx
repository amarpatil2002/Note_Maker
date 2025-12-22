import { createContext, useEffect, useState } from "react";
import api from '../api/axios'
import axios from "axios";
import { toast } from "react-toastify";


export const NoteContext = createContext({
    createNote:(data) => {},
    updateNote:(id,updatedData) => {},
    deleteNote:(id) => {}
})

const NoteContextProvider = ({children}) => {

    const [allNotes , setAllNotes] = useState([])

    const token = localStorage.getItem('accessToken')
    const BASE_API_URL = "http://localhost:4000/api"

    useEffect(() => {
        const getAllNotes = async() => {
            const res = await axios.get(`${BASE_API_URL}/notes` , {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })
            // console.log(res);
            // setAllNotes(prev => [...prev , res.data.allNotes])
            setAllNotes(res.data.allNotes)
        }
        getAllNotes()

    } , [allNotes])

    const createNote = async(data) => {
        try {
            const res = await axios.post(`${BASE_API_URL}/notes` ,data , {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

            if(res.data.success){
                toast.success(res.data.message)
                setAllNotes(prev => [...prev , res.data.userNotes])
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        }
    }

    const updateNote = async(id,data) => {
        console.log(data);
        try {
            const res = await axios.put(`${BASE_API_URL}/notes/${id}` , data , {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            })

            if(res.data.success){
                setAllNotes(prev => prev.map((note) => note._id === id?res.data.updatedNote:note))
                toast.success(res.data.message)
            }

        } catch (error) {
            // console.log(error.response.data.message);
            toast.error(error.response.data.message)
        }
    }

    const deleteNote = async(id) => {
        try {
            const res = await axios.delete(`${BASE_API_URL}/notes/${id}` , {headers:{Authorization:`Bearer ${token}`}})

            if(res.data.success){
                setAllNotes(prev => prev.filter((item) => item._id!==id))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (<NoteContext.Provider value={{allNotes,setAllNotes , createNote,updateNote,deleteNote}}>
        {children}
    </NoteContext.Provider>)
}

export default NoteContextProvider

