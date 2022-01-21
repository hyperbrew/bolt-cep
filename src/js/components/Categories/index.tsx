import React from "react";
import { useState, useEffect } from "react";
import {Container, Title, CategoryContainer, CategoryImg} from "./styles";
import {supabase} from "../../services/supabase";







const Categories: React.FC = () => {
  const [myCategories, setMyCategories]= useState([])
  const [category, setCategory] = useState([])
 
  
  useEffect(()=>{
    fetchCategories()
   
  }, [])
  
  async function fetchCategories(){
  
    const data : any = await supabase
    .from('categories')
    .select('*')
    setMyCategories(data.data);
    
    console.log("data: ", data)
    console.log(myCategories)
    
    
  
  }
  
  function alertMe(name:any){
    alert(name)
  }


  // const sorted_by_id = myCategories.sort((a,b) => {
  //   return a.id - b.id
  // });


    return(

    <Container>
      

        {myCategories.map((myCategories:any) => (

                
                        <CategoryContainer key={myCategories.id}>
                       
                        <CategoryImg key={myCategories.id} src={myCategories.image} alt={myCategories.name}/>
                        <Title > {myCategories.name} </Title>
                       
                        </CategoryContainer>
                            
                    ))}
    </Container>

    )


};

export default Categories;



// function data(data: any) {
//   throw new Error("Function not implemented.");
// }
  