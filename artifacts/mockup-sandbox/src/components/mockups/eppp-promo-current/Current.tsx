import { ArrowRight } from "lucide-react";
import { Button } from "./_Button";
import "./_group.css";

export function Current() { return <div className="landing-root"><article className="landing-suite" data-testid="suite-card-eppp">
              <h2 className="landing-suite-title">EPPP Mastery Suite</h2>
              <img src="/__mockup/images/eppp-chrome-crown.webp" alt="" className="landing-suite-artwork" aria-hidden width={1200} height={951} />
              <p>The EPPP Mastery Suite is designed to help you study effectively and pass the licensing exam on the FIRST try.</p>
              <p>Prepare confidently for a fraction of the cost.</p>
              <div className="mt-auto pt-6 w-full">
                <Button asChild className="landing-eppp-promo w-full gap-2">
                  <a href="#" onClick={(event) => event.preventDefault()} data-testid="button-landing-eppp-promo">
                    Try EPPP free for 7 days
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </a>
                </Button>
              </div>
            </article></div>; }
