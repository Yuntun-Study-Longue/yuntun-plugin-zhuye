import React, { Component } from 'react';
import { withRouter } from 'react-router';
import Helmet from 'react-helmet';

const SITE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://yuntun-bj.com';

const defaultTitle = '云吞官网';
const defaultDescription =
  '云吞教育科技有限公司线下主要产品是云吞自习室，致力于考研、考博、考证等能力提升证明的备考，提供安静、舒适的学习环境';
const defaultSep = ' | ';

class Page extends Component {
  getMetaTags(
    {
      title,
      description,
      image,
      contentType,
      twitter,
      noCrawl,
      published,
      updated,
      category,
      tags
    },
    pathname
  ) {
    const theTitle = title
      ? (title + defaultSep + defaultTitle).substring(0, 60)
      : defaultTitle;
    const theDescription = description
      ? description.substring(0, 155)
      : defaultDescription;

    const metaTags = [
      { itemprop: 'name', content: theTitle },
      { itemprop: 'description', content: theDescription },
      { name: 'keywords', content: '务实写字楼,314,1v2桌,自习室,24h自习,海淀自习室,蓟门里,文慧园,积水潭,大钟寺,最近自习室'},
      { name: 'description', content: theDescription }
    ];

    if (noCrawl) {
      metaTags.push({ name: 'robots', content: 'noindex, nofollow' });
    }

    if (published) {
      metaTags.push({ name: 'article:published_time', content: published });
    }
    if (updated) {
      metaTags.push({ name: 'article:modified_time', content: updated });
    }
    if (category) {
      metaTags.push({ name: 'article:section', content: category });
    }
    if (tags) {
      metaTags.push({ name: 'article:tag', content: tags });
    }

    return metaTags;
  }

  render() {
    const { children, id, className, ...rest } = this.props;

    return (
      <div id={id} className={className}>
        <Helmet
          htmlAttributes={{
            lang: 'zh-CN',
            itemscope: undefined,
            itemtype: `http://schema.org/${rest.schema || 'WebPage'}`
          }}
          title={
            rest.title ? rest.title + defaultSep + defaultTitle : defaultTitle
          }
          link={[
            {
              rel: 'canonical',
              href: SITE_URL + this.props.location.pathname
            }
          ]}
          meta={this.getMetaTags(rest, this.props.location.pathname)}
        />
        {children}
      </div>
    );
  }
}

export default withRouter(Page);
