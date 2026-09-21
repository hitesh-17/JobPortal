import api from "./axios";

export const resumeUpload = async (fromData) =>{
    const response = await api.patch("user/resume",fromData);
    return response.data
}