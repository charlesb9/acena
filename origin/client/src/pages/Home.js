import React from "react";
import Layout from '../components/Layout'
import Hero from '../components/home/Hero'
import Features from '../components/home/Features'
import About from '../components/home/About'

export default function Home() {

  return (
    <Layout noSubHeader>
      <Hero />
      <Features />
      <About />
    </Layout>
  );
}
