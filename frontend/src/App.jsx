import ScrollToTop from './components/ScrollToTop'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import RevenuePilot from './components/RevenuePilot'
import StyleMatch from './components/StyleMatch'
import LookTransfer from './components/LookTransfer'
import BeautyIntel from './components/BeautyIntel'
import Features from './components/Features'
import Footer from './components/Footer'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}>
        <ScrollToTop />
      <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"              element={<Hero />} />
            <Route path="/revenue-pilot" element={<RevenuePilot />} />
            <Route path="/style-match"   element={<StyleMatch />} />
            <Route path="/look-transfer" element={<LookTransfer />} />
            <Route path="/beauty-intel"  element={<BeautyIntel />} />
            <Route path="/features"      element={<Features />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}