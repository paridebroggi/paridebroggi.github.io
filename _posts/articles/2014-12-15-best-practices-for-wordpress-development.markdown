---
date: 2014-12-15 23:02:57 +100
layout: article
category: articles
subcategory: dev

tags: "wordpress, theme, developing, guide, beginners"
title:  "WordPress beginner's guide"
subtitle: "Best practices and starting kit"
excerpt: "Best practices for beginners to approach WordPress development. This post collects in one place the minimal knowledge to start developing a WordPress theme."
---

![Wordpress Logo]({{ site.imagesurl | append: '2014-12-15-wordpress-development-best-practice.jpg' | absolute_url }})


Crafting a WordPress theme from scratch is not as simple as it seems. The reason is that WordPress is not just a blogging platform anymore, but it has gradually become a refined publishing ecosystem with thousands of features. In this post I will propose some best practices to approach WordPress development in a reasoned way. The article is meant for beginners and aims to collect in one place the necessary knowledge to start developing a WordPress theme.

__1. Tools &amp; Docs__

It could sound pretty obvious, but the first thing to do is to gather information about the technologies we’re going to use. To code a WordPress theme you need to know basics of PHP, HTML5, CSS and JavaScript. Being comfortable with jQuery is not necessary, but will help.

Concerning the platform itself, you can rely on the official [WordPress Codex Pages](https://codex.wordpress.org), a very [active community](https://wordpress.org/support), a [Stack Exchange channel](https://wordpress.stackexchange.com) and a big amount of [blogs](https://www.smashingmagazine.com/2012/08/23/how-to-become-a-top-wordpress-developer/) and forums. However, It’s better considering at first the official documentation. WordPress is still in development, and the web is plenty of old deprecated snippets of code.

__2. Fundamentals__

Before coding, you should take some time to understand how WordPress works. The [Hierarchy](https://codex.wordpress.org/Template_Hierarchy), the [Query](https://codex.wordpress.org/Class_Reference/WP_Query), the [Loops](https://codex.wordpress.org/The_Loop) and [Actions](https://codex.wordpress.org/Plugin_API) (Hooks and Filters) are the fundamental concepts you should familiarize with.

<span style="color: #ff0000;">The Hierarchy</span>
Basically WordPress is a PHP engine that retrieves (on the server or in a MySQL database) the content requested by the reader, and then serves it with the corresponding template. The so-called hierarchy is the combination of the logic and priority rules that WordPress follows each time a request is done. Understanding when and how requests are satisfied is crucial to keep the design of your theme clean. [Here](https://wphierarchy.com) you can find a helpful and interactive diagram that links the different queries to the respective documentation.

<span style="color: #ff0000;">The Query</span>
The Query is the hearth of WordPress. It is the core process that fetches the request content. Technically is a PHP Class which instantiates a PHP object with all the information concerning the requested content.  All encapsulated data are then made available to the Loop.

<span style="color: #ff0000;">The Loop</span>
The easiest way to understand the Loop is to figure it as a printer. Firstly the Query retrieves the requested content according to the Hierarchy rules, then the Query shares its results with the WordPress Loop, and finally the Loop makes them available for the output via a set of specific PHP functions. While in plain PHP you’re used to call printf or echo to display something on the screen, in the WordPress environment you should always recur to the built-in specific Loop functions. A typical expression of WordPress jargon is: “This function must be used within the Loop”. In simple words, that means the function must be called in the front-end part of your theme, where you define how the content is displayed.

<span style="color: #ff0000;">Hooks</span>
WordPress is both hi-standardized and customizable. To achieve this equilibrium, its designers have deployed a mechanism of hooks and filters that allows developers to manipulate hi-level behaviors and appearance without modifying the core. Every customizable process is identified with a hook. Via the hooks developers can inject their custom code and apply filters.

{% highlight php %}
/*
** Action example: Inject code after the "switch theme" event hook.
** This code sets the "recent posts", "categories", "archives" as default widgets.
*/

function your_theme_set_default_widgets()
{
  $your_theme_default_widgets =  array (
    'wp_inactive_widgets' => array (),
    'your-theme-main-sidebar' => array (
      0 => 'recent-posts-2',
      1 => 'archives-2',
      2 => 'categories-2',
    ),
    'array_version' => 3
  );
  update_option( 'sidebars_widgets', $your_theme_default_widgets );
}
add_action('after_switch_theme', 'your_theme_set_default_widgets');
{% endhighlight%}

<span style="color: #ff0000;">Filters</span>
A filter is a PHP function that modifies a WordPress process at run time. Filters are the best way to make WordPress do everything you need for your project.

{% highlight php %}
/*
**A filter to exclude Home Code Snippets Post from Homepage.
*/

function your_theme_exclude_category_from_home( $query )
{
  if ( $query->is_home() && $query->is_main_query() )
  {
    $query->set( 'cat', -get_cat_ID( 'snippets' ) );
  }
  return $query;
}
add_filter( 'pre_get_posts', 'your_theme_category_from_home' );
{% endhighlight %}

__3. Architecture__
We can divide a WordPress theme in two functional parts: the back-end and the front-end.

<span style="color: #ff0000;">Back-end</span>
The back-end part of a theme is the PHP code that provides all the data and logic that our theme requires (features, dedicated dashboard areas, specific data or properties, etc.). For example, if we would like to display a reading time at the top of each post, then we must code a PHP function that calculates that value and makes it available to the front-end components.

The right place where to put our “reading time feature” is in the function.php file. This file is the core of the back-end. We can both use it to implement custom features and override WordPress standards behaviors.

<span style="color: #ff0000;">Front-end</span>
The front-end part is actually made up by all the different PHP/HTML templates we use in our theme. Usually we have a template for the home page (index.php), another for the post (single.php), for the archives (archives.php), and so on… Every PHP/HTML template will be filled with the content provided by the Loop functions or the specific data generated by our custom back-end.

__4. Frameworks__

I strongly recommend using a starter theme to guide you trough your first WordPress theme. It’s easier to build on the top of a well-designed existing structure, instead of coding everything from scratch. Using a framework created by WordPress experts is also a good opportunity to discover and learn best practices and great tricks. There are several starters out there. IMHO the best ones are Underscores and Bone.

<span style="color: #ff0000;">Underscores</span>
[Underscores](https://underscores.me) (also written literally as _s) is a starter theme maintained by the Automattic team. It is really complete, clean and 100% compliant with all the most recent WordPress standards and guidelines. It provides you with a quite complete file structure, a CSS style sheet with all the minimum-required WordPress classes and styles, and it implements all the basic features you need to build a functional WordPress theme. Its lightness and minimalism allow you to transform it in what you want: from a neat writer blog to a beautiful designer portfolio until an extensive news website.

<span style="color: #ff0000;">Bones</span>

[Bones](https://themble.com/bones/), as his motto says, is a more sophisticated WordPress starter. It adds several advanced features to the toolbox of a WordPress developer. It comes with a mobile-first approach, responsive layouts, SASS, custom post types and custom dashboard out of the box. It’s an awesome developing companion, but maybe it suits better to those who have already experienced WordPress developing and now want to take their projects to the next level.

__4. Debugging__

Debug quite often your project, even if not complete. The community shares a lot of useful debugging tools. Here is a shortlist of a strictly minimal starter toolkit:

- [Enable the WordPress Debug Mode](https://codex.wordpress.org/Debugging_in_WordPress) in the wp-config.php file. This will tell WordPress to prompt all the errors encountered and to flush a warning message on the screen. Debug mode is really handy, especially to track bugs or deprecated implementations that don’t cause critic crashes.
- [Theme-Check](https://wordpress.org/plugins/theme-check/) is a nice plugin that analyses your code and finds all the errors, warnings or missing required features according to WordPress standards. Having a zero errors, zero warnings and zero recommendations is the first goal for building an excellent WordPress Theme.

![ThemeCheck passed]({{ site.imagesurl | append: '2014-12-15-theme-check-passed.jpg' | absolute_url }})


- [Total Security](https://wordpress.org/plugins/total-security) is a plugin that helps you debugging security aspects of your WordPress theme and installation. It monitors your code for security weaknesses and tells you how to easily fix them. A must have if you think about selling your projects.
- [FakerPress](https://wordpress.org/plugins/fakerpress/) is another lightweight plugin that creates Lore Ipsum content. It is really intuitive and it gives a quick visual feedback of your work while developing.
- [WordPress Theme Unit Test](https://codex.wordpress.org/Theme_Unit_Test) is the official WordPress content tool to test your theme. It is a XML file that contains a wide range of content samples (pages, posts, categories, tags, menu items, images, galleries, videos, etc.). It must be imported via the WordPress importer in the dashboard tools section. It is a key test in the releasing pipeline of a WordPress theme.


__5. The code__

It’s now time to dive deeper in code details.

<span style="color: #ff0000;">File organisation</span>

- Keep the back-end and front-end of your theme as more separated as possible. Code your support functions in the function.php file rather than in your template files.
- Elements like navigation-bars, toolbars and widget-bars are shared to all templates. Better outputting them via a function than hardcoding them in each template file. This will let you easily modify the menu from a single place too.

{% highlight php %}
/*
** Display a clean navigation menu bar in all pages.
*/

if ( ! function_exists( 'your_navmenu' ) ) :
function your_navmenu()
{
  $navmenuParameters = array(
    'theme_location'  => 'your-navmenu',
    'container'     => 'nav',
    'container_class' => 'navmenu',
    'echo'        => false,
    'depth'       => 0,
  );
  echo strip_tags(wp_nav_menu( $navmenuParameters ) );
}
endif;
{% endhighlight %}


- If you plan to add a dedicated dashboard area to your theme, consider creating a specific file that will be then included in function.php.

{% highlight php %}
/*
**Create a custom menu in the dashboard appeareance section.
**It lets the user set his twitter account a profile image.
*/

function your_theme_settings_manager( $wp_customize )
{
  $wp_customize->add_section( 'your_theme_settings', array(
        'title'   => 'your_theme Theme Settings',
        'priority'  => 1,
  ) );

  // Twitter
  $wp_customize->add_setting( 'set_twitter', array(
        'default' => '',
        'capability'=> 'edit_theme_options',
        'transport' => 'refresh',
        'sanitize_callback' => 'sanitize_text_field',
  ) );

  $wp_customize->add_control( 'set_twitter', array(
        'label'   => 'Twitter Account (without the @)',
        'section' => 'your_theme_settings',
        'type'    => 'text',
  ) );

  // Profile Image
  $wp_customize->add_setting( 'set_profile_image', array(
        'default' => get_template_directory_uri() . '/images/profile.jpg',
        'capability'=> 'edit_theme_options',
        'transport' => 'refresh',
        'sanitize_callback' => 'sanitize_raw_url',
  ) );

  $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'set_profile_image', array(
        'label'   => 'Profile image',
        'section' => 'your_theme_settings',
        'settings'  => 'set_profile_image',
  ) ) );
}
add_action( 'customize_register', 'your_theme_settings_manager' );
{% endhighlight %}


- If you load assets from a cdn (like fonts, style sheets or scripts) remember to provide a local copy as a fallback.
- Name your files wisely following WordPress naming rules and conventions.
<span style="color: #ff0000;">Implementation</span>

- To include template or custom ﬁles don’t use PHP standard function like include() or require(). WordPress guidelines recommend [get_template_part()](https://codex.wordpress.org/Function_Reference/get_template_part) or locate_template() instead.
- Use a unique prefix for all your theme’s function names, classes, hooks, public/global variables, and database entries to avoid conflict issues with plugins or other themes. A common practice is to assign a slug to your theme and use it as prefix.
- WordPress comes with a localisation structure out of the box. It’s a good practice not to put variables in translatable strings.
- Don’t directly access or modify the database in order to preserve optimal levels of security and performance. WordPress offers a safe, cached and flexible way to work with databases via the Query class.
- Reserve a template to the no-content case (no posts yet, no result after searching, no archives, etc.)

{% highlight php %}
/*
** No content template
*/

if ( is_search() )
{
    esc_html_e( 'The search returned no result. Please, try with different keywords. Otherwise you can enjoy a recent post or browse the archives below. ', 'your-theme' );
}
elseif ( is_category() )
{
    esc_html_e( 'Sorry, but there is no post for this category. ', 'your-theme' );
}
else
{
    esc_html_e( 'Nothing found.', 'your-theme' );
}
{% endhighlight %}


- Privilege the readability and the maintainability of your code over performances. Naive syntax choices (like inline-coding) have negligible effects on 99% of the projects. If you need to dramatically improve your installation performances consider installing a caching plugin before start counting your for loops backwards (when in doubt: Google it! ).
- When referencing other files within the same theme, avoid hard-coded URIs and file paths. Instead use WordPress built-in function [get_template_directory_uri()](https://codex.wordpress.org/Function_Reference/get_template_directory_uri) / [get_stylesheet_directory_uri()](https://codex.wordpress.org/Function_Reference/get_stylesheet_directory_uri) to reference the URIs and file paths via their respective template tags.
- PHP short tags are deprecated.
<span style="color: #ff0000;">Style sheets and scripts</span>
WordPress installations usually host custom themes, custom styles, custom plugins and custom scripts. In order to make all these components work together flawlessly some importing rules must be respected.
- Use specific function [wp_register_style()](https://codex.wordpress.org/Function_Reference/wp_register_style) or [wp_enqueue_style()](https://codex.wordpress.org/Function_Reference/wp_enqueue_style) to include your CSS files, and [wp_register_script()](https://codex.wordpress.org/Function_Reference/wp_register_script) or [wp_enqueue_script()](https://codex.wordpress.org/Function_Reference/wp_enqueue_script) for scripts.

{% highlight php %}
/*
** Enqueue scripts and styles.
*/

function your_theme_scripts()
{
//Load Julien Shapiros's velocity.js library for smoother animations */
  wp_register_script( 'velocity', get_template_directory_uri() . '/inc/velocity/velocity.min.js', array('jquery'), '1.0', true);
  wp_enqueue_script( 'velocity' );
  wp_register_script( 'velocity-ui', get_template_directory_uri() . '/inc/velocity/velocity.ui.min.js', array('jquery', 'velocity'), '1.0', true);
  wp_enqueue_script( 'velocity-ui' );

  wp_register_script( 'home-script', get_template_directory_uri() . '/js/home.js', array('jquery'), '1.0', true);
  wp_register_script( 'single-script', get_template_directory_uri() . '/js/single.js', array('jquery', 'velocity', 'velocity-ui'), '1.0', true);
  wp_register_script( 'search-result-script', get_template_directory_uri() . '/js/search-result.js', array('jquery'), '1.0', true);
  wp_register_script( '404-script', get_template_directory_uri() . '/js/404.js', array('jquery'), '1.0', true);
}
add_action( 'wp_enqueue_scripts', 'your_theme_scripts' );

function your_theme_css()
{
  wp_register_style( 'swipebox-css', get_template_directory_uri() . '/inc/swipebox/src/css/swipebox.min.css', array(), '1.0', 'screen' );
  wp_enqueue_style( 'swipebox-css' );
  wp_register_style( 'stylesheet', get_template_directory_uri() . '/style.css', array(), '1.0', 'screen' );
  wp_enqueue_style( 'stylesheet' );
  wp_register_style( 'prism', get_template_directory_uri() . '/inc/prism/prism.css', array(), '1.0', 'screen' );
  wp_enqueue_style( 'prism' );
}
add_action( 'wp_enqueue_scripts', 'your_theme_css' );
{% endhighlight %}


- Hardcoded inline styles are deprecated, dynamic inline styles are accepted where necessary, and [wp_add_inline_style()](https://wpseek.com/function/wp_add_inline_style/) is strongly encouraged.
- Avoid importing assets directly in style.css via @import function. Notice: Google Fonts  or Facetype Fonts must be included with above functions too.
- Choose conditional script enqueuing over massive one. It’s a waste of resources loading a heavy gallery script in the contact page. WordPress inbuilt scripts-handling functions are great to fine-tune the dependencies loading time.

{% highlight php %}
/*
** Enqueueing swipebox script ad prism script only in the single.php template
** To enqueue a script you must register it before in you funciton.php
*/

get_header();
wp_enqueue_script( 'swipebox-script' );
wp_enqueue_script( 'prism-script' );
{% endhighlight %}


- For performance sake enqueue a script in the footer rather than in the header.
- If you need to share data between WordPress PHP code and JavaScript/jQuery scripts you can use [wp_localize_script()](https://codex.wordpress.org/Function_Reference/wp_localize_script) in a clever way.

{% highlight php %}
//Passing PHP data to JavaScript
wp_enqueue_script( 'single-script' );
wp_localize_script( 'single-script', 'phpData', array(
  'featuredImage' => $featuredImage,
  'titleColor' => get_post_meta($post->ID, 'titlecolor', true),
  'twitter' => $twitter,
  'excerpt' => get_the_excerpt(),
));
{% endhighlight %}

- Avoid deregistering default jQuery script to enqueue a custom version. Force you to be 100% compliant with the version included in the latest WordPress package. This will largely improve the compatibility of your project.
- Always use JavaScript strict mode to avoid conflicts with plugins or add-ons. Chaching DOM elements is a good habit. Keep the code clear, understandable and maintainable is more important than performance.

{% highlight js %}
/*
** No conflicts jQuery
*/

(function($)
{
  'use strict';
  var $window;
  var $width;
  var $height;
  var $titleSingle;

  /*----------------------------------------------
  INITIALIZE
  -----------------------------------------------*/
  $window = $(window);
  $titleSingle = $(".title-single");

  $window.resize(function()
  {
    $width = $window.width();
    $height = $window.height();
    $titleSingle.css("top", $height / 2);
  });

  $(document).ready(function()
  {
    //here I put all my code
    $window.trigger('resize');
  }
})(jQuery);
{% endhighlight %}

- Prefer document ready instruction over anonymous onload functions.


__6. Security__

Every time you put online a website you unavoidably expose it to all kind of threatens. That’s why security is such a critical aspect of web developing. WordPress comes with a bunch of well-experimented tools to help you handling the two main security issues: data validation and sanitization.

<span style="color: #ff0000;">Validation</span>
For validation we mean all the tests and checks that your code must run in order to ensure that inserted data correspond to what your back-end expects. For instance, that an email is an email address for real (with an @ and a domain), that a date is a real date (33/14/-9123 and similar are not allowed) and so on.

<span style="color: #ff0000;">Sanitization (or escaping)</span>
For sanitization we mean all the filters applied to data to make them safe and trustable in a specific context. For instance, to display HTML code in a text area it would be necessary to replace all the HTML tags by their entity equivalents. Or when displaying the content of a PHP variable on a webpage it would be necessary to make JavaScript injections impossible.

A validation routine must be applied to all inputs, while a sanitization one to all outputs. To do that, it’s always better to recur to the dedicated WordPress functions.

__Outputs__

- [esc_html()](https://codex.wordpress.org/Function_Reference/esc_html) for escaping HTML blocks.
- [esc_attr()](https://codex.wordpress.org/Function_Reference/esc_attr) Encodes the &lt;, >, &amp;, " and ' (less than, greater than, ampersand, double quote and single quote) characters.
- [esc_url()](https://codex.wordpress.org/Function_Reference/esc_url) for escaping URLs that will be printed to the page.
- [esc_raw_url()](https://codex.wordpress.org/Function_Reference/esc_url_raw) for escaping URLs to save to the database or use in URL redirecting.
- [esc_js()](https://codex.wordpress.org/Function_Reference/esc_js) to avoid JavaScript injections.
- [esc_sql()](https://codex.wordpress.org/Function_Reference/esc_sql) prepares a string for use as an SQL query
- [esc_textarea()](https://codex.wordpress.org/Function_Reference/esc_textarea) encodes text for use inside a textarea element.
- [esc_html_e()](https://codex.wordpress.org/Function_Reference/esc_html_e) displays translated text that has been escaped for safe use in HTML output.

__Inputs__

- [sanitize_text_field()](https://codex.wordpress.org/Function_Reference/sanitize_text_field) checks for invalid UTF-8, Convert single &lt; characters to entity, strip all tags, remove line breaks, tabs and extra white space, strip octets.
- [sanitize_email()](https://codex.wordpress.org/Function_Reference/sanitize_email) strips out all characters that are not allowable in an email address.
- [sanitize_html_class()](https://codex.wordpress.org/Function_Reference/sanitize_html_class) sanitizes a html classname to ensure it only contains valid characters.
- [sanitize_file_name()](https://codex.wordpress.org/Function_Reference/sanitize_file_name) removes special characters that are illegal in filenames on certain operating systems and special characters requiring special escaping to manipulate at the command line. Replaces spaces and consecutive dashes with a single dash.
- [wp_unique_filename()](https://codex.wordpress.org/Function_Reference/wp_unique_filename) to make sure it has a filename that is sanitized and unique for the given directory.


This is NOT an exhaustive list of the WordPress functions available for validation and sanitization. I'd recommend reading further on WordPress official codex pages. Anyway a general good rule is: when in doubt trust WordPress. In fact all hi-level WordPress functions embed a robust sanitization/validation routine.
