import React from "react";
import Input from '../../ReUsableComponents/Input/Input'
import {useParams, useNavigate} from "react-router-dom";

const Explore = () => {
    const {tag} = useParams();
    const navigate = useNavigate();

    console.log('tag', tag);
    const navigateTo = (tag)=>{
        console.log('tag', tag);
        navigate(`/explore/${tag}`);
    };
  return (
    <div>
      <Input placeholder="Search..." />
      <div className="flex flex-1">
        <button onClick={()=>navigateTo("")}>For you</button>
        <button onClick={()=>navigateTo("tabs/trending")}>Trending</button>
        <button onClick={()=>navigateTo("tabs/news")}>News</button>
        <button onClick={()=>navigateTo("tabs/sports")}>Sports</button>
        <button onClick={()=>navigateTo("tabs/entertainment")}>Entertainment</button>
      </div>
    </div>
  );
};

export default Explore;
