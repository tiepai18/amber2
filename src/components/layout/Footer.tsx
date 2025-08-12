import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-[#FBDBB7]/30 text-[#62220C]">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About Section */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 inline-block">
              <Image
                src="/images/logo.webp"
                alt="The Crochet Corner Logo"
                width={140}
                height={60}
              />
            </Link>
            <p className="text-sm text-[#62220C]/80">
              Crafting joy, one stitch at a time. Handmade with love for you and
              your loved ones.
            </p>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="font-bold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop/amigurumi" className="hover:underline">
                  Amigurumi
                </Link>
              </li>
              <li>
                <Link href="/shop/patterns" className="hover:underline">
                  Patterns
                </Link>
              </li>
              <li>
                <Link href="/shop/kits" className="hover:underline">
                  Crochet Kits
                </Link>
              </li>
              <li>
                <Link href="/shop/yarn" className="hover:underline">
                  Yarn & Tools
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:underline">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:underline">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:underline">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:underline">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="font-bold mb-4">Join Our Newsletter</h3>
            <p className="text-sm text-[#62220C]/80 mb-4">
              Get exclusive discounts, new pattern alerts, and crafting tips!
            </p>
            <form className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white/50 border-[#C5B5B0]"
              />
              <Button
                type="submit"
                className="bg-[#62220C] text-white hover:bg-[#8B4513]"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-[#C5B5B0]/50 pt-8 text-center text-sm text-[#62220C]/70">
          <p>
            &copy; {new Date().getFullYear()} The Crochet Corner. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
