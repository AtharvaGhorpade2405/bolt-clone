import { WebContainer } from '@webcontainer/api';
import { useEffect, useState } from 'react';

export function useWebContainer(){

  const [webcontainer, setWebcontainer]=useState<WebContainer>();
  async function main(){
    // Call only once
    const webcontainerInstance = await WebContainer.boot();
    setWebcontainer(webcontainerInstance)
  }
  useEffect(()=>{
    main()
  },[])
  return webcontainer
}