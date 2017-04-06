<!DOCTYPE html>
<html lang="en">

<head>
    <title>{% block title %}HillsonTech{% endblock %}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="/assets/css/tachyons.min.css">
    <link rel="stylesheet" href="/assets/css/styles.css">
</head>

<body>

    <header class="sans-serif">
        <div class="cover bg-left bg-center-l" style="background-image: url(http://mrmrs.io/photos/u/011.jpg)">
            <div class="bg-black-80 pb5 pb6-m pb7-l">
                <nav class="dt w-100 mw8 center">
                    <div class="dtc w2 v-mid pa3">
                        <a href="/" class="dib-ns w4 b--white-90 grow-large border-box">
            {#<svg class="link white-90 hover-white" data-icon="skull" viewBox="0 0 32 32" style="fill:currentcolor"><title>skull icon</title><path d="M16 0 C6 0 2 4 2 14 L2 22 L6 24 L6 30 L26 30 L26 24 L30 22 L30 14 C30 4 26 0 16 0 M9 12 A4.5 4.5 0 0 1 9 21 A4.5 4.5 0 0 1 9 12 M23 12 A4.5 4.5 0 0 1 23 21 A4.5 4.5 0 0 1 23 12"></path></svg>#}
            <img src="/assets/images/htg_logo.png">
          </a>
                    </div>
                    <div class="dtc v-mid tr pa3">
                        <a class="f6 fw4 hover-white no-underline white-70 dn dib-l pv2 ph3" href="/">Home</a>
                        <a class="f6 fw4 hover-white no-underline white-70 dn dib-l pv2 ph3" href="/">Services</a>
                        <a class="f6 fw4 hover-white no-underline white-70 dn dib pv2 ph3" href="/">Products</a>
                        <a class="f6 fw4 hover-white no-underline white-70 dn dib pv2 ph3" href="/">Training</a>
                        <a class="f6 fw4 hover-white no-underline white-70 dn dib-l pv2 ph3" href="/">Contact Us</a>
                        <a class="f6 fw4 hover-white no-underline white-70 dib ml2 pv2 ph3 ba" href="/">Log In</a>
                        <a class="f6 fw4 hover-white no-underline white-70 dib ml2 pv2 ph3 ba" href="/">Sign Up</a>
                    </div>
                </nav>
                <div class="tc-l mt4 mt5-m mt6-l ph3">
                    <h1 class="f2 f1-l fw2 white-90 mb0 lh-title">Hillson Technology Global</h1>
                    <h2 class="fw1 f3 white-80 mt3 mb4">..... Technology Our Concern</h2>
                    <a class="f6 no-underline grow dib v-mid  white ba b--white ph3 pv2 mb3" href="/">Ask for services</a>
                    <span class="dib v-mid ph3 white-70 mb3">or</span>
                    <a class="f6 no-underline grow dib v-mid white ba b--white ph3 pv2 mb3" href="">Ask for training</a>
                </div>
            </div>
        </div>
    </header>

    {% block content %} Default content {% endblock %}

    <footer style="background-image:url(/assets/images/back.gif);" class="tc-l bg-center cover bg-black">

        <div class="cf w-100 center ph3 bg-black-80">
            <h1 class="fl w-100 pv0 f4 fw6 ttu tracked mb4 white-70">Contact Us</h1>
            <article class="fl w-50 dib-ns w-auto-ns mr4-m mr5-l mb4 pr2 pr0-ns">
                <h4 class="f5 f4-l fw6 white-70">Ghana Office</h4>
                <div class="f7 f6-l db white-70">Ray Makosa Trafic Light</div>
                <div class="f7 f6-l white-70">By Ola Secondary School</div>
                <div class="f7 f6-l white-70">Ho-V/R</div>
                <a class="f6 db fw6 pv3 white-70 link dim" title="Call SF" href="tel:+233553821542">
                     Tel: +233 (0) 553821542
                 </a>
                <a class="f6 db fw6 pv3 white-70 link dim" title="Call SF" href="mailto:info@hillsontechglobal.com">
                     E-mail: info@hillsontechglobal.com
                 </a>

            </article>
            <article class="fr w-50 dib-ns w-auto-ns mr4-m mr5-l mb4 pl2 pl0-ns">
                <h4 class="f5 f4-l fw6 white-70">Nigeria Office</h4>
                <div class="f7 f6-l db white-70">Suite 81 DEO Gratias, FCT, Anuja-Nigeria</div>
                <div class="f7 f6-l di white-70">
        Los Angeles, CA 90048
      </div>
                <a href="tel:+2348140734442" class="f6 db fw6 pv3 link dim white-70" title="Call the LA office.">
        Tel: +2348140734442
      </a>
                <a class="f6 db fw6 pv3 white-70 link dim" title="Call SF" href="mailto:info@hillsontechglobal.com">
                     E-mail:info@hillsontechglobal.com
                 </a>
            </article>
        </div>

        <div class="w-100 center ph3 pb3 bg-black-80">
            <a class="link dim gray dib h2 w2 br-100 mr3 mv3" href="#" title="">
                <svg data-icon="facebook" viewBox="0 0 32 32" style="fill:currentcolor">
                    <title>facebook icon</title>
                    <path d="M8 12 L13 12 L13 8 C13 2 17 1 24 2 L24 7 C20 7 19 7 19 10 L19 12 L24 12 L23 18 L19 18 L19 30 L13 30 L13 18 L8 18 z"></path>
                </svg>
            </a>
            <a class="link dim gray dib h2 w2 br-100 mr3 mv3" href="#" title="">
                <svg data-icon="twitter" viewBox="0 0 32 32" style="fill:currentcolor">
                    <title>twitter icon</title>
                    <path d="M2 4 C6 8 10 12 15 11 A6 6 0 0 1 22 4 A6 6 0 0 1 26 6 A8 8 0 0 0 31 4 A8 8 0 0 1 28 8 A8 8 0 0 0 32 7 A8 8 0 0 1 28 11 A18 18 0 0 1 10 30 A18 18 0 0 1 0 27 A12 12 0 0 0 8 24 A8 8 0 0 1 3 20 A8 8 0 0 0 6 19.5 A8 8 0 0 1 0 12 A8 8 0 0 0 3 13 A8 8 0 0 1 2 4"></path>
                </svg>
            </a>
            <a class="link dim gray dib br-100 h2 w2 mr3 mv3" href="#" title="">
                <svg data-icon="github" viewBox="0 0 32 32" style="fill:currentcolor">
                    <title>github icon</title>
                    <path d="M0 18 C0 12 3 10 3 9 C2.5 7 2.5 4 3 3 C6 3 9 5 10 6 C12 5 14 5 16 5 C18 5 20 5 22 6 C23 5 26 3 29 3 C29.5 4 29.5 7 29 9 C29 10 32 12 32 18 C32 25 30 30 16 30 C2 30 0 25 0 18 M3 20 C3 24 4 28 16 28 C28 28 29 24 29 20 C29 16 28 14 16 14 C4 14 3 16 3 20 M8 21 A1.5 2.5 0 0 0 13 21 A1.5 2.5 0 0 0 8 21 M24 21 A1.5 2.5 0 0 0 19 21 A1.5 2.5 0 0 0 24 21 z"></path>
                </svg>
            </a>
            <a class="link dim gray dib br-100 h2 w2 mr3 mv3" href="#" title="">
                <svg data-icon="dribbble" viewBox="0 0 32 32" style="fill:currentcolor">
                    <title>dribbble icon</title>
                    <path d="M16 0 A16 16 0 0 0 0 16 A16 16 0 0 0 16 32 A16 16 0 0 0 32 16 A16 16 0 0 0 16 0 M5 11.5 A12 12 0 0 1 11 5 A46 46 0 0 1 13.5 9.25 A46 46 0 0 1 5 11.5 M15 4 A12 12 0 0 1 21.5 5.25 A46 46 0 0 1 17 7.75 A50 50 0 0 0 15 4 M4 16 A50 50 0 0 0 15 13 A46 46 0 0 1 16 15.5 A26 26 0 0 0 6 22.5 A12 12 0 0 1 4 16 M18.5 11.5 A50 50 0 0 0 25 8 A12 12 0 0 1 28 13.75 A26 26 0 0 0 19.75 14.5 A50 50 0 0 0 18.5 11.5 M17 19.5 A46 46 0 0 1 18 28 A12 12 0 0 1 8.75 25.5 A22 22 0 0 1 17 19.5 M20.75 18.25 A22 22 0 0 1 28 17.75 A12 12 0 0 1 22 26.5 A50 50 0 0 0 20.75 18.25"></path>
                </svg>
            </a>
            <small class="f6 db tc white-60 ">© 2017 <b class="ttu ">HILLSON TECHNOLOY GLOBAL LTD.</b>, All Rights Reserved</small>

            <div class="mt4">
                <a href="#" class="f6 link dim gray dib mr3 mr4-ns">Help</a>
                <a href="#" class="f6 link dim gray dib mr3 mr4-ns">Send feedback</a>
                <a href="#" class="f6 link dim gray dib mr3 mr4-ns">Privacy</a>
                <a href="#" class="f6 link dim gray dib">Terms</a>
            </div>

        </div>

    </footer>
    <script src="/assets/js/ScrollMagic.min.js " type="text/javascript " />
    <script src="/assets/js/scripts.js " type="text/javascript " />
</body>

</html>