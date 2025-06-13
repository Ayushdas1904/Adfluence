'use client';

import { Logos3 } from "@/components/logos3"
import nike from '@/public/nike.svg'
import adidas from '@/public/adidas.svg'
import redbull from '@/public/redbull.svg'
import tinder from '@/public/tinder.svg'
import swiggy from '@/public/swiggy.svg'
import uber from '@/public/uber.svg'
import zomato from '@/public/zomato.svg'
import spotify from '@/public/spotify.svg'
import Sevenup from '@/public/7up.svg'
import discord from '@/public/discord.svg'
import yamaha from '@/public/yamaha.svg'
import jeep from '@/public/jeep.svg'
import jordan from '@/public/jordan.svg'
import dolby from '@/public/dolby.svg'
import lacoste from '@/public/lacoste.svg'

const demoData = {
    heading: "Trusted by these brands",
    logos: [
        {
            id: "logo-1",
            description: "Nike",
            image: nike.src,
            className: "h-10 w-auto invert",
        },
        {
            id: "logo-2",
            description: "Jeep",
            image: jeep.src,
            className: "h-7 w-auto filter invert",
        },
        {
            id: "logo-3",
            description: "Tinder",
            image: tinder.src,
            className: "h-7 w-auto",
        },
        {
            id: "logo-4",
            description: "Adidas",
            image: adidas.src,
            className: "h-10 w-auto filter invert",
        },
        {
            id: "logo-5",
            description: "Red Bull",
            image: redbull.src,
            className: "h-12 w-auto",
        },
        {
            id: "logo-6",
            description: "yamaha",
            image: yamaha.src,
            className: "h-7 w-auto filter invert",
        },
        {
            id: "logo-7",
            description: "Discord",
            image: discord.src,
            className: "h-7 w-auto",
        },
        
    ],
};

const demoData2 = {
    heading: "",
    logos: [
        {
            id: "logo-9",
            description: "Swiggy",
            image: swiggy.src,
            className: "h-10 w-auto",
        },
        {
            id: "logo-10",
            description: "Uber",
            image: uber.src,
            className: "h-7 w-auto filter invert",
        },
        {
            id: "logo-11",
            description: "Spotify",
            image: spotify.src,
            className: "h-7 w-auto",
        },
        {
            id: "logo-12",
            description: "Zomato",
            image: zomato.src,
            className: "h-7 w-auto",
        },
        {
            id: "logo-13",
            description: "7Up",
            image: Sevenup.src,
            className: "h-10 w-auto",
        },
        {
            id: "logo-14",
            description: "jordan",
            image: jordan.src,
            className: "h-10 w-auto filter invert",
        },
        {
            id: "logo-15",
            description: "dolby",
            image: dolby.src,
            className: "h-7 w-auto filter invert",
        },
        {
            id: "logo-16",
            description: "Lacoste",
            image: lacoste.src,
            className: "h-7 w-auto filter invert",
        },
    ],
};

export default function LogoCarousel() {
    return (
        <div>
            <Logos3 {...demoData} />
            <Logos3 {...demoData2}  />
        </div>
    )
}
