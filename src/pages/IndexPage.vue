<template>
  <q-page class="hero-section text-white overflow-hidden">
    <!-- Advanced Mesh Background -->
    <div class="mesh-bg"></div>

    <!-- Hero Section -->
    <div id="home" class="row q-col-gutter-xl q-px-lg q-py-xl q-pa-md-xl items-center justify-center min-height-hero relative-position">
      <div class="col-12 col-md-6 q-pa-md-xl text-center text-md-left overflow-hidden">
        <div class="q-mb-lg text-primary text-weight-bold text-uppercase letter-spacing-2 flex flex-center flex-md-start items-center no-wrap">
          <q-badge rounded color="primary" class="q-mr-sm" />
          <span style="font-size: 0.75rem">Open Source Foundation 2026</span>
        </div>
        <h1 class="responsive-h1 text-weight-bolder q-mt-none q-mb-md leading-tight">
          Master Your <br>
          <span class="text-gradient">Nebula Galaxy</span>
        </h1>
        <p class="text-subtitle1 text-grey-4 q-mb-xl font-light leading-relaxed max-width-600 q-mx-auto q-mx-md-none">
          Deploy a state-of-the-art management ecosystem. 100% Free forever.
          Automate student lifecycles and scale with precision.
        </p>
        <div class="row q-gutter-md justify-center justify-md-start">
          <q-btn size="lg" unelevated label="Get Started" class="btn-modern shadow-cyan full-width-sm" to="/register" />
        </div>

        <div class="row q-mt-xl q-gutter-xl text-grey-4 justify-center justify-md-start">
          <div class="col-auto">
            <div class="text-h5 text-weight-bold text-gradient">Free</div>
            <div class="text-caption text-uppercase">Forever</div>
          </div>
          <div class="col-auto">
            <div class="text-h5 text-weight-bold text-gradient">Open</div>
            <div class="text-caption text-uppercase">Source</div>
          </div>
          <div class="col-auto">
            <div class="text-h5 text-weight-bold text-gradient">Secure</div>
            <div class="text-caption text-uppercase">Architecture</div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 text-center relative-position q-mt-xl q-mt-md-none">
        <div class="hero-image-container">
          <q-img
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"
            class="rounded-borders-32 shadow-24 hero-img card-advanced"
            style="max-width: 100%; width: 500px;"
          >
            <div class="absolute-bottom q-ma-md bg-glass q-pa-md border-glow">
              <div class="row items-center no-wrap">
                <q-spinner-orbit color="primary" size="24px" />
                <div class="q-ml-sm text-left">
                  <div class="text-weight-bold text-subtitle2">System Online</div>
                  <div class="text-caption text-grey-5 gt-xs">Open source core sync</div>
                </div>
              </div>
            </div>
          </q-img>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div id="features" class="q-px-lg q-py-xl q-pa-md-xl relative-position" style="padding-top: 100px; padding-bottom: 100px;">
      <div class="text-center q-mb-xl">
        <div class="text-primary text-weight-bold text-uppercase q-mb-sm">Core Technology</div>
        <h2 class="responsive-h2 text-weight-bold q-mt-none text-white">Everything in <span class="text-gradient">One Ecosystem</span></h2>
      </div>

      <div class="row q-col-gutter-xl justify-center items-stretch">
        <div v-for="feature in features" :key="feature.title" class="col-12 col-sm-6 col-md-4">
          <q-card class="bg-glass q-pa-xl card-advanced text-white full-height flex flex-center flex-column">
            <q-card-section class="text-center full-width">
              <div class="feature-icon-container q-mx-auto q-mb-lg">
                <q-icon :name="feature.icon" size="32px" class="text-gradient" />
              </div>
              <div class="text-h6 text-weight-bold q-mb-md">{{ feature.title }}</div>
              <p class="text-grey-5 leading-relaxed text-body2">{{ feature.description }}</p>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Open Source Section -->
    <div id="opensource" class="q-px-lg q-py-xl q-pa-md-xl relative-position">
      <div class="q-pa-xl bg-glass border-glow rounded-borders-32 text-center overflow-hidden">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6 text-center text-md-left">
            <h2 class="responsive-h2 text-weight-bold q-mb-md">Truly <span class="text-gradient">Open Source</span></h2>
            <p class="text-h6 text-grey-4 q-mb-xl font-light leading-relaxed">
              We democratizing education management. No hidden fees or lock-ins.
              Access the full power without spending a single rupee.
            </p>
            <div class="row q-gutter-md justify-center justify-md-start">
                <q-btn unelevated color="primary" label="GitHub" icon="info" class="btn-modern q-px-xl" />
                <q-btn outline color="white" label="Docs" class="btn-modern q-px-xl gt-xs" />
            </div>
          </div>
          <div class="col-12 col-md-6">
            <div class="row q-col-gutter-lg">
                <div v-for="benefit in osmFeatures" :key="benefit.title" class="col-6">
                    <div class="bg-glass q-pa-md rounded-borders-16 border-glow text-left card-hover full-height">
                        <q-icon :name="benefit.icon" color="primary" size="24px" class="q-mb-sm" />
                        <div class="text-subtitle1 text-weight-bold text-white q-mb-xs">{{ benefit.title }}</div>
                        <div class="text-grey-5 text-caption">{{ benefit.desc }}</div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div id="faq" class="q-px-lg q-py-xl q-pa-md-xl row justify-center" style="padding-top: 100px; padding-bottom: 100px;">
      <div class="col-12 col-md-8">
        <div class="text-center q-mb-xl">
          <div class="text-primary text-weight-bold text-uppercase q-mb-sm">Support</div>
          <h2 class="responsive-h2 text-weight-bold">Common <span class="text-gradient">Questions</span></h2>
        </div>
        <q-list padding class="bg-glass rounded-borders-32 q-pa-md shadow-24 border-glow">
          <q-expansion-item
            v-for="(faq, index) in faqs"
            :key="index"
            :label="faq.q"
            header-class="text-h6 text-weight-bold text-grey-3 q-pa-lg"
            expand-icon-class="text-primary"
            class="faq-item"
          >
            <q-card class="bg-transparent">
              <q-card-section class="text-grey-5 q-px-xl q-pb-xl leading-relaxed text-body2">
                {{ faq.a }}
              </q-card-section>
            </q-card>
            <q-separator v-if="index < faqs.length - 1" dark style="opacity: 0.05" />
          </q-expansion-item>
        </q-list>
      </div>
    </div>

    <!-- Final CTA Section -->
    <div class="q-px-lg q-py-xl q-pa-md-xl text-center">
      <div class="q-pa-xl bg-glass-dark rounded-borders-32 overflow-hidden relative-position border-glow">
        <h2 class="responsive-h1 text-weight-bold q-mb-md">Start Building Your <br><span class="text-gradient">Legacy Today</span></h2>
        <p class="text-h6 text-grey-5 q-mb-xl">Join 500+ institutes already using Nebula to manage their success.</p>
        <q-btn size="xl" unelevated label="Activate Nebula" class="btn-modern q-px-xl shadow-cyan" to="/register" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
const features = [
  {
    title: 'Smart Enrollment',
    description: 'Effortlessly register students with digital forms and automatic ID generation. Keep all records organized.',
    icon: 'api'
  },
  {
    title: 'Attendance Tracking',
    description: 'QR-based attendance system that notify parents instantly when students arrive or leave.',
    icon: 'sensors'
  },
  {
    title: 'Fee Management',
    description: 'Automated fee collection with receipt generation and reminders. Supports multiple payment methods.',
    icon: 'account_balance_wallet'
  },
  {
    title: 'Performance Reports',
    description: 'Generate detailed academic reports and growth charts to visualize student progress.',
    icon: 'insights'
  },
  {
    title: 'Class Scheduling',
    description: 'Dynamic calendar management to avoid clashes and keep students updated on class timings.',
    icon: 'auto_awesome_motion'
  },
  {
    title: 'Parent Communication',
    description: 'Direct SMS/Email integration to keep parents informed about academic results.',
    icon: 'terminal'
  }
]

const osmFeatures = [
    { title: 'Zero Cost', desc: 'Free for everyone.', icon: 'savings' },
    { title: 'Full Control', desc: 'Host on your servers.', icon: 'security' },
    { title: 'Customizable', desc: 'Modify code easily.', icon: 'tune' },
    { title: 'Community', desc: 'Open source core.', icon: 'groups' }
]

const faqs = [
  {
    q: 'is it really free?',
    a: 'Yes, the core platform is 100% free and open source. You can download and deploy it without paying any licensing fees.'
  },
  {
    q: 'How long does it take to setup?',
    a: 'You can get started in less than 5 minutes. Our onboarding guide will help you import your student data instantly.'
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. Since you host it yourself, you have total control over your data. We use enterprise-grade encryption.'
  },
  {
    q: 'Mobile app support?',
    a: 'The platform is mobile-first. Access the system from any smartphone with a seamless experience.'
  }
]
</script>

<style lang="scss">
.responsive-h1 {
  font-size: clamp(2rem, 9vw, 4rem);
}

.responsive-h2 {
  font-size: clamp(1.5rem, 6vw, 3rem);
}

.min-height-hero {
  min-height: 90vh;
}

.max-width-600 {
    max-width: 600px;
}

.rounded-borders-32 {
  border-radius: 32px;
}

@media (max-width: 599px) {
  .rounded-borders-32 {
    border-radius: 20px;
  }
}

.leading-tight {
  line-height: 1.1;
}

.leading-relaxed {
  line-height: 1.6;
}

.letter-spacing-2 {
  letter-spacing: 2px;
}

.hero-img {
  animation: float-advanced 8s ease-in-out infinite;
}

.feature-icon-container {
    width: 64px;
    height: 64px;
    background: rgba(6, 182, 212, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 16px;
    border: 1px solid rgba(6, 182, 212, 0.2);
}

.border-glow {
    border: 1px solid rgba(6, 182, 212, 0.2);
    box-shadow: 0 0 30px rgba(6, 182, 212, 0.05);
}

.shadow-cyan {
    box-shadow: 0 10px 30px -10px rgba(6, 182, 212, 0.5);
}

@keyframes float-advanced {
  0% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-30px) rotate(2deg); }
  66% { transform: translateY(-10px) rotate(-1deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}

.hero-image-container {
  padding: 40px;
  &::before {
    content: '';
    position: absolute;
    width: 80%;
    height: 80%;
    background: #06b6d4;
    filter: blur(150px);
    opacity: 0.15;
    z-index: -1;
    top: 10%;
    left: 10%;
  }
}

.full-width-sm {
    @media (max-width: 599px) {
        flex: 1;
    }
}
</style>
