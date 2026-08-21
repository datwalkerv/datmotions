import localFont from 'next/font/local'

export const sfProDisplay = localFont({
  src: [
    { path: '../fonts/SF-Pro-Display-Regular.otf', weight: '400', style: 'normal' },
    { path: '../fonts/SF-Pro-Display-Medium.otf', weight: '500', style: 'normal' },
    { path: '../fonts/SF-Pro-Display-Semibold.otf', weight: '600', style: 'normal' },
    { path: '../fonts/SF-Pro-Display-Bold.otf', weight: '700', style: 'normal' },
    { path: '../fonts/SF-Pro-Display-Heavy.otf', weight: '800', style: 'normal' },
    { path: '../fonts/SF-Pro-Display-Black.otf', weight: '900', style: 'normal' },
  ],
  variable: '--font-sf-pro-display',
  display: 'swap',
})

export const neueHaasDisplay = localFont({
  src: [
    { path: '../fonts/NeueHaasDisplayLight.ttf', weight: '300', style: 'normal' },
    { path: '../fonts/NeueHaasDisplayMediu.ttf', weight: '500', style: 'normal' },
    { path: '../fonts/NeueHaasDisplayBold.ttf', weight: '700', style: 'normal' },
    { path: '../fonts/NeueHaasDisplayBlack.ttf', weight: '900', style: 'normal' },
  ],
  variable: '--font-neue-haas-display',
  display: 'swap',
})

export const fraunces = localFont({
  src: [
    { path: '../fonts/Fraunces_72pt-SemiBold.ttf', weight: '600', style: 'normal' },
    { path: '../fonts/Fraunces_72pt-Bold.ttf', weight: '700', style: 'normal' },
    { path: '../fonts/Fraunces_72pt-Black.ttf', weight: '900', style: 'normal' },
    { path: '../fonts/Fraunces_72pt-SemiBoldItalic.ttf', weight: '600', style: 'italic' },
  ],
  variable: '--font-fraunces',
  display: 'swap',
})
