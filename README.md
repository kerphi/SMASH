# SMASH

## Branding Options

Header

```html
<!-- /**header** /-->

<!-- /**header** /-->
```

Footer
```html
<!-- /**footer** /-->
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.min.js"></script>
<script src="https://my-assets.com/static/resolver.min.js"></script>
<script src="https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js"></script>
<script>
  // Include the UserVoice JavaScript SDK (only needed once on a page)
  UserVoice=window.UserVoice||[];(function(){var uv=document.createElement('script');uv.type='text/javascript';uv.async=true;uv.src='//widget.uservoice.com/XXXXXXXXXXXXXXXXXXXX.js';var s=document.getElementsByTagName('script')[0];s.parentNode.insertBefore(uv,s)})();
  // Set colors
  UserVoice.push(['set', {
  accent_color: 'rgb(27, 152, 248)',
  trigger_color: 'white',
  trigger_background_color: 'rgba(46, 49, 51, 0.6)',
  screenshot_enabled: false,
  smartvote_enabled: false,
  post_idea_enabled: false,
  locale: "fr"
  }]);
  UserVoice.push(['addTrigger', { mode: 'contact', trigger_position: 'bottom-right' }]);
</script>
<!-- /**footer** /-->

```

## Advanced Options

Page Head
```html
<meta charset="utf-8">

<!--[if lt IE 9]><script src="http://cdnjs.cloudflare.com/ajax/libs/html5shiv/3.7/html5shiv.js"></script><![endif]-->

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-XXXXXXXX-Y', 'auto');
  ga('send', 'pageview');
</script>
```
